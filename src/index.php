<?php
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");
header('Content-Type: text/xml');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");


class DataSource {
    /** @var string | int $swimlane */
    private $swimlane;
    /** @var string $corpToken */
    private $corpToken;
    /** @var string $domainRoot */
    private $domainRoot;
    /** @var bool $xmlEnabled */
    private $xmlEnabled;
    /** @var string $filterField */
    private $filterField;
    /** @var array $filterValues */
    private $filterValues;


    /**
     * Data constructor.
     */
    function __construct() {
        $this->setConfigOptions();
    }

    /**
     * data
     * @return array
     */
    public function getJobData() {
        if(xmlEnabled) {
            $url = 'https://public-rest'.$this->getSwimlane().
            '.bullhornstaffing.com/rest-services/'.$this->getCorpToken().
            '/search/JobOrder?query=(isOpen:1%20AND%20isDeleted:0)'.
            $this->getQuery().
            '&fields=id,title,address(city,state,zip),employmentType,dateLastPublished,publicDescription&count=500&sort=-dateLastPublished&start=0';
            $ch = curl_init($url);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
            curl_setopt($ch, CURLOPT_HTTPGET, 1);
            return json_decode(curl_exec($ch))->data;
        }
        return [];
    }

    public function setConfigOptions() {
        $config =  json_decode(file_get_contents('http://'.$_SERVER['HTTP_HOST'].str_replace('feed/','app.json',$_SERVER['REQUEST_URI'])));
        $this->swimlane = $config->service->swimlane;
        $this->corpToken = $config->service->corpToken;
        $this->xmlEnabled = $config->jobXmlEnabled;
        $this->filterField = $config->additionalJobCriteria->field;
        $this->filterValues = $config->additionalJobCriteria->values;
    }

    /**
     * getSwimlane
     * @return string | int
     */
    private function getSwimlane() {
        return $this->swimlane;
    }

    /**
     * getCorpToken
     * @return string
     */
    private function getCorpToken() {
        return $this->corpToken;
    }

    /**
     * getQuery
     * @return string
     */
    private function getQuery() {
        if ($this->filterField == true && count($this->filterValues) > 0 && $this->filterField !== '[ FILTER FIELD HERE ]' && $this->filterValues[0] !== '[ FILTER VALUE HERE ]') {
            $query = ' AND (';
            foreach($this->filterValues as $value) {
                $query .= ' OR ';
                $query .= $this->filterValues.':"'.$value.'"';
            }
            return $query;
        }
        return '';
    }
}


$dataClass = new DataSource();
$data = $dataClass->getJobData();


$url = 'http://'.$_SERVER['HTTP_HOST'].$_SERVER['REQUEST_URI'];
$timestamp = time();
$output = '<rss version="2.0"><channel><title> Job Opportunities </title><link>' .$url.'</link><pubDate>'.date('D, d M Y H:i:s T', $timestamp).'</pubDate><ttl>5</ttl>';

foreach($data as $job) {
    $properties = array(
      'title'=>'title',
      'employmentType'=>'jobType',
      'publicDescription'=>'description',
      'address'=>'address',
      'dateLastPublished' => 'date',
      'url' => 'link',
    );
    $output .= '<item>';
    foreach($properties as $key => $value) {
        switch ($key) {
            case 'address':
                $output .= '<city>'.htmlspecialchars($job->$key->city).'</city>';
                $output .= '<state>'.htmlspecialchars($job->$key->state).'</state>';
                $output .= '<zip>'.htmlspecialchars($job->$key->zip).'</zip>';
                break;
            case 'url':
                $output .= '<'.$value.'>'.htmlspecialchars(str_replace('feed/','#/jobs/'.$job->id,$url)).'</'.$value.'>';
                break;
            case 'dateLastPublished':
                $output .= '<'.$value.'>'.htmlspecialchars(date('D, d M Y H:i:s T', $job->$key/1000)).'</'.$value.'>';
                break;
            default:
                $fieldValue = $job->$key;
                if(is_array($fieldValue)) {
                    $fieldValue = $fieldValue[0];
                }
                $output .= '<'.$value.'>'.htmlspecialchars($fieldValue).'</'.$value.'>';
                break;
        }
    }
    $output .= '</item>';

}


$output .= '</channel></rss>';

echo $output;